import PageContainer from "@/web/components/layout/page-container";
import {
  createSupabaseServerClient,
  Presentation,
  User,
} from "@/web/lib/supabase-server";
import { PresentationForm } from "./presentation-form";

export default async function PresentationViewPage({
  presentation,
  user,
}: {
  presentation: Presentation;
  user: User;
}) {
  const supabase = await createSupabaseServerClient();
  const presentationSlides = await supabase
    .from("slides")
    .select("*")
    .eq("presentation_id", presentation.id);

  return (
    <PageContainer>
      <PresentationForm
        presentation={presentation}
        slides={presentationSlides.data ?? []}
        user={user}
      />
    </PageContainer>
  );
}
