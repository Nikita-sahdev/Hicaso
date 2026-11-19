import { requireAdmin } from "@/lib/admin/guard";
import { readLeads } from "@/lib/leads";
import EnquiriesTable from "./EnquiriesTable";

// Every enquiry the site's form has sent (/api/enquiry appends them to LEADS_FILE), newest first.
export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const leads = await readLeads();
  return (
    <>
      <h1>Enquiries</h1>
      <p>
        {leads.length
          ? `${leads.length} ${leads.length === 1 ? "enquiry" : "enquiries"} from the contact form, newest first. Each one was also emailed.`
          : "No enquiries yet. They appear here as soon as someone sends the contact form."}
      </p>
      <EnquiriesTable leads={leads} />
    </>
  );
}
