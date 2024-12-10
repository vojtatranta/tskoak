import { RedirectImage } from "@/components/RedirectImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Presentation, Slide, User } from "@/lib/supabase-server";

export function PresentationForm({
  presentation,
  slides,
  user,
}: {
  presentation: Presentation;
  slides: Slide[];
  user: User;
}) {
  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {presentation.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {presentation.thumbnail_url && (
            <div>
              <RedirectImage
                width="400px"
                src={presentation.thumbnail_url}
                alt="presentation thumbnail"
              />
            </div>
          )}
        </div>
        <div>
          <div className="mt-8 grid grid-cols-3 gap-6">
            <h2 className="text-2xl font-bold col-span-3">Slides</h2>
            {slides.map((slide) => (
              <div key={slide.id} className="col-span-1">
                <div className="text-sm text-muted-foreground">
                  {slide.object_id}
                </div>
                {slide.thumbnail_url && (
                  <RedirectImage
                    src={slide.thumbnail_url}
                    alt={`slide ${slide.object_id} thumbnail`}
                  />
                )}
                <div className="text-sm text-muted-foreground">
                  {slide.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
