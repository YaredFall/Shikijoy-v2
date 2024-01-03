import { useParams } from "react-router-dom";
import Feed from "./feed";
import { ShowCategory } from "@/types/animejoy";

type CategoryPageProps = {
  category: ShowCategory;
};

export default function CategoryPage({ category }: CategoryPageProps) {

  return (
    <main className="p-8">
      <Feed category={category} />
    </main>
  );
}