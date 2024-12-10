import PageContainer from "@/web/components/layout/page-container";
import {
  createSupabaseServerClient,
  Slide,
  User,
} from "@/web/lib/supabase-server";
import { SlideForm } from "./slide-form";
import { notFound } from "next/navigation";

export default async function SlideViewPage({
  slide,
  user,
}: {
  slide: Slide;
  user: User;
}) {
  const supabase = await createSupabaseServerClient();
  const presentation = await supabase
    .from("presentations")
    .select("*")
    .eq("presentation_id", slide.presentation_id)
    .eq("user_id", user.id)
    .single();

  if (!presentation.data) {
    console.warn("no presentation found");
    notFound();
  }

  return (
    <PageContainer>
      <SlideForm presentation={presentation.data} slide={slide} user={user} />
    </PageContainer>
  );
}
