import { PageHead } from "@/components/page-head";
import { DocumentRequirements } from "@/components/live/document-requirements";
import { DEFAULT_REQUIREMENTS } from "@/lib/documents";
import { getSession } from "@/server/auth";
import { agencyRequirements } from "@/server/queries";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const s = await getSession();
  const live = Boolean(s?.agency);
  const req = s?.agency ? await agencyRequirements(s.agency.id) : { list: DEFAULT_REQUIREMENTS, customized: false };
  return (
    <>
      <PageHead
        eyebrow="Settings"
        title="Required documents"
        sub="The documents your office asks caregivers for. Caregivers see this checklist when they share their vault with you, so nobody sends papers one by one."
      />
      <DocumentRequirements initial={req.list} customized={req.customized} canEdit={!s?.agency || s.agency.role === "owner"} live={live} />
    </>
  );
}
