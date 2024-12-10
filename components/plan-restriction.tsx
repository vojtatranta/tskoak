import { createSupabaseServerClient, getUser } from "@/lib/supabase-server";
import { getPlanRange } from "@/lib/utils";

type PlanRestrictionChildren =
  | React.ReactNode
  | ((props: {
      plan: PlanWithProduct;
      planRange: {
        from: number;
        to: number;
      };
      numberOfMonthlyAnswers: number;
    }) => React.ReactNode);

export function PlanRestriction({
  plan,
  children,
  withValidPlanContent,
  numberOfAnswers,
}: {
  plan: PlanWithProduct | undefined;
  children: PlanRestrictionChildren;
  withValidPlanContent?: React.ReactNode;
  numberOfAnswers?: number;
}) {
  if (!plan) {
    return null;
  }

  const planRange = getPlanRange(plan);

  if (!planRange) {
    return null;
  }

  if (
    typeof numberOfAnswers !== "undefined" &&
    withValidPlanContent &&
    numberOfAnswers < planRange.to
  ) {
    return withValidPlanContent;
  }

  return typeof children === "function"
    ? children({
        plan,
        planRange,
        numberOfMonthlyAnswers: numberOfAnswers ?? Infinity,
      })
    : children;
}

export async function PlanRestrictionWrapper({
  children,
  withValidPlanContent,
}: {
  children: PlanRestrictionChildren;
  withValidPlanContent?: React.ReactNode;
}) {
  return <>{children}</>;
}
