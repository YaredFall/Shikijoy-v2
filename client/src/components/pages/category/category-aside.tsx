import Aside from "@/components/layouts/blocks/aside/aside";
import { ShowCategory } from "@/types/animejoy";

type CategoryAsideProps = {
    category: ShowCategory;
};

export default function CategoryAside({ category }: CategoryAsideProps) {
    return (
        <Aside>
            <section>
                {category.name + " aside"}
            </section>
        </Aside>
    );
}