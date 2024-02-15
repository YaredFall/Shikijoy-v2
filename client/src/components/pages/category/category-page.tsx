import Main from "@/components/layouts/blocks/main/main";
import { ShowCategory } from "@/types/animejoy";
import Feed from "./feed";
import CategoryAside from "@/components/pages/category/category-aside";

type CategoryPageProps = {
    category: ShowCategory;
};

export default function CategoryPage({ category }: CategoryPageProps) {

    return (
        <>
            <Main>
                <Feed category={category} />
            </Main>
            <CategoryAside category={category} />
        </>
    );
}