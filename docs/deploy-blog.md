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

   - `TRUST_PROXY` is the number of proxies in front of the app: `1` for Apache alone, `2` if the Cloudflare orange cloud is on for hicaso.com (check the DNS tab in Cloudflare). With `0`, every visitor shares one login-limit bucket, so 10 bad logins from anyone lock sign-in for 15 minutes.
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

   The scripts run `.ts` files directly through Node. A `MODULE_TYPELESS_PACKAGE_JSON` warning is harmless; ignore it.

6. Create the admin account (password at least 12 characters; it asks for it without echoing).

   ```
   npm run admin:create -- owner@hicaso.com
   ```

   Use the owner's real email. To skip the prompt, set `ADMIN_PASSWORD=...` on the same command line. Running it again for the same email resets the password.

7. Restart the app the way it runs today. It must run in production mode (`npm start`) and be reached over HTTPS, because the login cookie is marked Secure only when `NODE_ENV=production`.

8. Check it.
   - `https://hicaso.com/admin` asks you to sign in.
   - Publish a test post, open `https://hicaso.com/blog` in a private window, and the post is there.
   - This shows `no-store`:

     ```
     curl -sI https://hicaso.com/blog | grep -i cache-control
     ```

   - Unpublish or delete the test post.

9. Back up every night with cron (`crontab -e`). Adjust the path if you keep backups elsewhere. `%` must be escaped in crontab.

   ```
   0 3 * * * pg_dump hicaso | gzip > /var/backups/hicaso-$(date +\%F).sql.gz
   10 3 * * * tar czf /var/backups/hicaso-uploads-$(date +\%F).tgz /var/lib/hicaso/uploads
   20 3 * * * find /var/backups -name 'hicaso-*' -mtime +14 -delete
   ```

   The last line keeps 14 days. `pg_dump hicaso` needs the cron user to be allowed into the database (a `~/.pgpass` file or a matching Postgres role).

10. Keep any CDN from caching `/blog*` or `/admin*` HTML. Cloudflare does not cache HTML by default; a "Cache Everything" rule would. The blog pages already send `no-store`.

## Things to know

- **Images:** PNG or JPEG only, at most 3 MB and 24 megapixels. They are re-encoded on upload and served from `/blog-images/` with a one-year immutable cache.
- **Freshness:** blog pages are never cached. Other pages refresh every 60 seconds, and an admin change refreshes them at once.
- **Upload size:** the app accepts request bodies up to 4 MB. If Apache sets `LimitRequestBody` below that, image uploads fail.
- **Login limit:** 10 failed sign-ins per IP or per account in 15 minutes locks sign-in for that IP or account.

## Known issues

- A removed post URL returns 404 correctly, but with JavaScript off it shows a blank page (Next's bare error shell) instead of the site's not-found page.
