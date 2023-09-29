import ImageGraph from "@/components/ImageGraph";
import dynamic from "next/dynamic";
const MyMap = dynamic(
  () => import("@/components/MyMap"), // Replace with the path to your actual map component file
  { ssr: false }
);
export default function Home() {
  return (
    <>
      <div className="max-w-4xl m-auto">
        <h1 className="pb-2 pt-2 text-2xl font-bold">
          Visualization of the Farcaster Network
        </h1>
        <MyMap />
      </div>
    </>
  );
}
