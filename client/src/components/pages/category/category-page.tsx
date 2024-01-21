import { ShowCategory } from "@/types/animejoy";
import Feed from "./feed";

type CategoryPageProps = {
    category: ShowCategory;
};

export default function CategoryPage({ category }: CategoryPageProps) {

    return (
        <main className={"p-8"}>
            <Feed category={category} />
        </main>
    );
}