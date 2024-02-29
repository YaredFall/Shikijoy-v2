import Aside from "@/components/layouts/blocks/aside/aside";
import AsideTabs from "@/components/pages/show/common/aside/aside-tabs";
import ShikimoriInfo from "@/components/pages/show/aside/shikimori-info";
import { KnownShowCategory } from "@/types/animejoy";

type ShowAsideProps = {
    category: KnownShowCategory;
};

export default function ShowAside({ category }: ShowAsideProps) {
    return (
        <Aside>
            <div className={"space-y-5 p-5"}>
                <ShikimoriInfo />
                <AsideTabs firstColumn={"related"} />
            </div>
        </Aside>
    );
}