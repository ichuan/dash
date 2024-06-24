import PriceCard from "@/components/price-card";
import MultiPriceCard from "@/components/multi-price-card";

export const metadata = {
  title: "Dashboard",
  description: "Crypto Dashboard",
};

export default async function Dashboard() {
  return (
    <div className='container max-w-screen-2xl items-center'>
      <main className='flex flex-1 flex-col gap-4 py-4 md:gap-8 md:py-8'>
        <div className='grid gap-4 lg:grid-cols-2 md:gap-8'>
          <PriceCard currency='usdc' />
          <PriceCard currency='dai' />
          <MultiPriceCard api='/api/aave' />
        </div>
      </main>
    </div>
  );
}
