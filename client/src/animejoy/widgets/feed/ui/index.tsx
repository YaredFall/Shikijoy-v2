import ShowCard from "@client/animejoy/entities/story/ui/show-card";
import { animejoyClient } from "@client/animejoy/shared/api/client";
import { categoryTransformer } from "@client/animejoy/shared/api/client/page";
import Container from "@client/shared/ui/kit/container";
import Pagination from "@client/shared/ui/kit/pagination";


export default function Feed() {
    const [{ stories }] = animejoyClient.page.useSuspenseQuery(undefined, {
        select: data => categoryTransformer(data),
    });

    return (
        <Container className={"px-6 py-0"}>
            <Pagination />
            <section className={"flex flex-col gap-8"}>
                {
                    (stories ?? Array(10).fill(undefined)).map((s, i) => <ShowCard key={i} data={s} />)
                }
            </section>
            <Pagination />
        </Container>
    );
}