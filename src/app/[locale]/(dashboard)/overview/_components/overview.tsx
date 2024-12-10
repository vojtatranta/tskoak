import { AreaGraph } from "./area-graph";
import { BarGraph } from "./bar-graph";
import { PieGraph } from "./pie-graph";
import {
  CalendarDateRangePicker,
  DateRangePickerProvider,
} from "@/web/components/date-range-picker";
import PageContainer from "@/web/components/layout/page-container";
import { RecentSales } from "./recent-sales";
import { Button } from "@/web/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/web/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/web/components/ui/tabs";
import { getTranslations } from "next-intl/server";
import { cn, getPlanRange } from "@/lib/utils";
import Link from "next/link";
import { FileInput } from "lucide-react";
import { OakUploadFrom } from "@/components/OakUploadFrom";

export default async function OverViewPage() {
  const t = await getTranslations();

  return (
    <PageContainer scrollable>
      <DateRangePickerProvider>
        <div className="space-y-2">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {t("overview.welcomeBack")} 👋
            </h2>
            <div className="hidden items-center space-x-2 md:flex">
              <CalendarDateRangePicker />
              <Button>{t("overview.download")}</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">
                {t("overview.overview")}
              </TabsTrigger>
              {/* <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger> */}
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upload your file
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OakUploadFrom />
                  </CardContent>
                </Card>

                {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Now
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card> */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DateRangePickerProvider>
    </PageContainer>
  );
}
