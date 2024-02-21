import Aside from "@/components/layouts/blocks/aside/aside";
import ShikimoriInfo from "@/components/pages/show/aside/shikimori-info";
import { KnownShowCategory } from "@/types/animejoy";

type ShowAsideProps = {
    category: KnownShowCategory;
};

export default function ShowAside({ category }: ShowAsideProps) {
    return (
        <Aside>
            <section className={"p-5"}>
                <ShikimoriInfo />
            </section>
        </Aside>
    );
}