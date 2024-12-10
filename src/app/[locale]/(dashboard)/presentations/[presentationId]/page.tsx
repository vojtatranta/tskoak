import { notFound } from "next/navigation";
import { createSupabaseServerClient, getUser } from "@/web/lib/supabase-server";
import PresentationViewPage from "../_components/presentation-view-page";

export const metadata = {
  title: "Dashboard : Presentation View",
};

export default async function Page({
  params,
}: {
  params: { presentationId: string };
}) {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();
  const presentation = await supabase
    .from("presentations")
    .select("*")
    .eq("id", params.presentationId)
    .eq("user_id", user.id)
    .single();

  console.log("presentation", presentation);

  if (!presentation.data) {
    console.warn("no presenttaion found");
    notFound();
  }

  return <PresentationViewPage presentation={presentation.data} user={user} />;
}
