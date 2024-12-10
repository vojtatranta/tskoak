import { RedirectImage } from "@/components/RedirectImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Presentation, Slide, User } from "@/lib/supabase-server";

export function SlideForm({
  presentation,
  slide,
  user,
}: {
  presentation: Presentation;
  slide: Slide;
  user: User;
}) {
  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {slide.object_id}
          <br />
          <span className="text-sm text-muted-foreground">
            {presentation.title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {slide.thumbnail_url && (
            <div>
              <RedirectImage
                width="400px"
                src={slide.thumbnail_url}
                alt="presentation thumbnail"
              />
            </div>
          )}
        </div>
        <div>
          <div className="mt-8 grid grid-cols-3 gap-6">
            <h2 className="text-2xl font-bold col-span-3">Slides</h2>

            <div>{slide.text}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
