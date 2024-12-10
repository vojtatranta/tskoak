import { notFound } from "next/navigation";
import { createSupabaseServerClient, getUser } from "@/web/lib/supabase-server";
import PresentationViewPage from "../_components/presentation-view-page";

export const metadata = {
  title: "Dashboard : Presentation View",
};

export default async function Page({
  params,
}: {
  params: { slideId: string };
}) {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();
  const slide = await supabase
    .from("slides")
    .select("*")
    .eq("id", params.slideId)
    .eq("user_id", user.id)
    .single();

  console.log("slide", slide);

  if (!slide.data) {
    console.warn("no slide found");
    notFound();
  }

  return <PresentationViewPage slide={slide.data} user={user} />;
}
