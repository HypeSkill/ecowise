import Hero from "./components/Hero";

export const metadata = {
  title: "EcoWise – Eco-smart AI Trip Planner",
  description:
    "Plan low-carbon trips with AI. EcoWise recommends sustainable routes, stays, and activities with clear impact insights.",
};

export default function Home() {
  return (
    <main className="min-h-screen font-sans transition-colors">
      <Hero />
    </main>
  );
}