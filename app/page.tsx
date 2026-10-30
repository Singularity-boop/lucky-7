import { ModeToggle } from "./components/CartPanel";
import { HeroSlider } from "./components/HeroSlider";
import { OrderMenu } from "./components/OrderMenu";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <div className="flex items-center gap-3 bg-card px-4 py-3 md:hidden">
        <ModeToggle className="w-48 shrink-0" />
        <p className="text-xs leading-tight text-muted">
          Open 5am to 11pm
          <br />
          Ready in ~20 min
        </p>
      </div>
      <OrderMenu />
    </>
  );
}
