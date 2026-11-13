# Deploying the blog and admin panel

For the Apache server that runs hicaso.com. Run every command on the server, as the user that runs the app, from the app folder. Needs Node 22.18 or newer (`node -v`).

The blog and `/admin` need Postgres. Without `DATABASE_URL` the site still runs, with no blog and no admin (both return 404).

1. Install Postgres if `psql --version` fails.

   ```
   sudo apt install postgresql
   ```

2. Create the database user and database.

   ```
   sudo -u postgres createuser hicaso -P
   sudo -u postgres createdb -O hicaso hicaso
   ```

3. Add these lines to `.env.local` (`.env.example` lists them too).

   ```
   DATABASE_URL=postgres://hicaso:<password>@localhost/hicaso
   UPLOADS_DIR=/var/lib/hicaso/uploads
   TRUST_PROXY=1
   ```

   Then `chmod 600 .env.local`. Use an alphanumeric database password: a special character in it must be URL-encoded inside `DATABASE_URL` (and escaped in `~/.pgpass` in step 9).

   - `TRUST_PROXY` is the number of proxies in front of the app, which the login limit uses to read the visitor's IP from `X-Forwarded-For`. Apache's `ProxyPass` adds that header itself. `1` for Apache alone, `2` if the Cloudflare orange cloud is on for hicaso.com (check the DNS tab in Cloudflare). With `0`, every visitor shares one login-limit bucket, so 10 bad logins from anyone lock sign-in for 15 minutes.
   - `UPLOADS_DIR` falls back to `./uploads` when unset. Keep it outside the web root.

4. Create the uploads folder, owned by the user that runs the app and closed to everyone else.

   ```
   sudo mkdir -p /var/lib/hicaso/uploads
   sudo chown "$(whoami)" /var/lib/hicaso/uploads
   chmod 700 /var/lib/hicaso/uploads
   ```

5. Build on the server so the image library (sharp) matches it, then create the tables.

   ```
   npm ci && npm run build
   npm run db:migrate
   ```

   Both `db:migrate` and `admin:create` load `.env.local` themselves (`node --env-file-if-exists=.env.local`), so run them from the app folder. They run `.ts` files directly through Node. A `MODULE_TYPELESS_PACKAGE_JSON` warning is harmless; ignore it.

6. Create the admin account (password at least 12 characters; it asks for it without echoing).

   ```
   npm run admin:create -- owner@hicaso.com
   ```

   Use the owner's real email. Type the password at the hidden prompt. Do not put it on the command line, where it lands in shell history. To skip the prompt in a script:

   ```
   read -rs ADMIN_PASSWORD && export ADMIN_PASSWORD
   npm run admin:create -- owner@hicaso.com
   unset ADMIN_PASSWORD
   ```

   Running it again for the same email resets the password.

7. Restart the app the way it runs today. It must run in production mode (`npm start`) and be reached over HTTPS, because the login cookie is marked Secure only when `NODE_ENV=production`.

8. Check it.
   - `https://hicaso.com/admin` asks you to sign in.
   - Publish a test post, open `https://hicaso.com/blog` in a private window, and the post is there.
   - This shows `no-store`:

     ```
     curl -sI https://hicaso.com/blog | grep -i cache-control
     ```

   - After a test post has an image, this shows the one-year immutable cache:

     ```
     curl -sI https://hicaso.com/blog-images/<file> | grep -i cache-control
     ```

   - Unpublish or delete the test post.

9. Back up every night with cron. The dumps hold password hashes and session tokens, so keep them in a folder only the app user can read.

   ```
   sudo mkdir -p /var/backups/hicaso
   sudo chown "$(whoami)" /var/backups/hicaso
   chmod 700 /var/backups/hicaso
   ```

   Cron has no password prompt, so give `pg_dump` the password through `~/.pgpass` (the database password from step 3; `:` and `\` in it must be escaped with `\`, another reason to keep it alphanumeric).

   ```
   echo 'localhost:5432:hicaso:hicaso:<password>' >> ~/.pgpass
   chmod 600 ~/.pgpass
   ```

   Then `crontab -e`. `%` must be escaped in crontab, and `umask 077` keeps the files private.

   ```
   0 3 * * * umask 077; pg_dump -h localhost -U hicaso hicaso | gzip > /var/backups/hicaso/db-$(date +\%F).sql.gz
   10 3 * * * umask 077; tar czf /var/backups/hicaso/uploads-$(date +\%F).tgz /var/lib/hicaso/uploads
   20 3 * * * find /var/backups/hicaso -type f -mtime +14 -delete
   ```

   The last line keeps 14 days. Copy the folder off the server too; a backup on the same disk does not survive the disk.

   **Restore.** Database, into an empty one (stop the app first):

   ```
   sudo -u postgres createdb -O hicaso hicaso_restore
   gunzip -c /var/backups/hicaso/db-<date>.sql.gz | psql -h localhost -U hicaso hicaso_restore
   ```

   Point `DATABASE_URL` at `hicaso_restore`, or drop `hicaso` and rename it. Uploads (the archive stores `var/lib/hicaso/uploads/...`, so extract from `/`):

   ```
   sudo tar xzf /var/backups/hicaso/uploads-<date>.tgz -C /
   ```

10. Keep any CDN from caching `/blog*` or `/admin*` HTML. Cloudflare does not cache HTML by default; a "Cache Everything" rule would. The blog pages already send `no-store`.

## Things to know

- **Images:** PNG or JPEG only, at most 3 MB and 24 megapixels. They are re-encoded on upload and served from `/blog-images/` with a one-year immutable cache.
- **Freshness:** blog pages are never cached. Other pages refresh every 60 seconds, and an admin change refreshes them at once.
- **Upload size:** the app accepts request bodies up to 4 MB. If Apache sets `LimitRequestBody` below that, image uploads fail.
- **Login limit:** 10 failed sign-ins per IP or per account in 15 minutes locks sign-in for that IP or account.

## Known issues

- A removed post URL returns 404 correctly, but with JavaScript off it shows a blank page (Next's bare error shell) instead of the site's not-found page.
