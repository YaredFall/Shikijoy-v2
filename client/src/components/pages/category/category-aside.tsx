import Aside from "@/components/layouts/blocks/aside/aside";
import AsideTabs from "@/components/pages/show/common/aside/aside-tabs";
import { KnownShowCategory } from "@/types/animejoy";

type CategoryAsideProps = {
    category: KnownShowCategory;
};

export default function CategoryAside({ category }: CategoryAsideProps) {
    return (
        <Aside>
            <div className={"space-y-5 p-5"}>
                <AsideTabs firstColumn={"news"} />
            </div>
        </Aside>
    );
}