import Aside from "@/components/layouts/blocks/aside/aside";
import { KnownShowCategory } from "@/types/animejoy";

type CategoryAsideProps = {
    category: KnownShowCategory;
};

export default function CategoryAside({ category }: CategoryAsideProps) {
    return (
        <Aside>
            <section className={"p-5"}>
                {category.name + " aside"}
            </section>
        </Aside>
    );
}