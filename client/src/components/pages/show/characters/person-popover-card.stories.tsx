import { Meta, StoryObj } from "@storybook/react";
import { useShikijoyApi } from "@/query-hooks/useShikijoyApi";
import { ShikimoriPerson } from "@/types/shikimori";
import { SHIKIJOY_API_ROUTES } from "@/utils/fetching";
import PersonPopoverCard from "./person-popover-card";


interface PersonPopoverCardWithHooksProps {
    id: number;
}

const PersonPopoverCardWithHooks = ({ id }: PersonPopoverCardWithHooksProps) => {

    const { data, error } = useShikijoyApi<ShikimoriPerson>(SHIKIJOY_API_ROUTES.shikimori_person(id));
    return (
        <div className={"w-1/3"}>
            <div className={"grid grid-cols-3"}>
                <PersonPopoverCard person={data} />
            </div>
            {!!error && String(error)}
        </div>
    );
};

const meta: Meta<PersonPopoverCardWithHooksProps> = {
    component: PersonPopoverCardWithHooks,
    tags: ["autodocs"],
    argTypes: {
        id: {
            type: "number",
            description: "id of the person in <a href='https://shikimori.one/api/doc/1.0/people/show'>shikimori people API</a>",
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;
export const Primary: Story = {
    args: {
        id: 21971,
    },
    render: ({ id }) => <PersonPopoverCardWithHooks id={id} />,
};