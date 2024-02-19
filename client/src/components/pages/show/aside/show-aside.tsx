import Aside from "@/components/layouts/blocks/aside/aside";
import ShikimoriInfo from "@/components/pages/show/aside/shikimori-info";
import { ShowCategory } from "@/types/animejoy";

type ShowAsideProps = {
    category: ShowCategory;
};

export default function ShowAside({ category }: ShowAsideProps) {
    return (
        <Aside>
            <section className={"p-5"}>
                {category.name + " aside"}
                <ShikimoriInfo />
            </section>
        </Aside>
    );
}