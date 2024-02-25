
import CharacterPopoverCard from "@/components/pages/show/characters/character-popover-card";
import { useShikijoyApi } from "@/query-hooks/useShikijoyApi";
import { ShikimoriCharacter } from "@/types/shikimori";
import { SHIKIJOY_API_ROUTES } from "@/utils/fetching";
import { Meta, StoryObj } from "@storybook/react";


interface CharacterPopoverCardWithHooksProps {
    id: number;
}

const CharacterPopoverCardWithHooks = ({ id }: CharacterPopoverCardWithHooksProps) => {

    const { data, error } = useShikijoyApi<ShikimoriCharacter>(SHIKIJOY_API_ROUTES.shikimori_character(id));
    return (
        <div className={"w-1/3"}>
            <div className={"grid grid-cols-3"}>
                <CharacterPopoverCard character={data} />
            </div>
            {!!error && String(error)}
        </div>
    );
};

const meta: Meta<CharacterPopoverCardWithHooksProps> = {
    component: CharacterPopoverCardWithHooks,
    tags: ["autodocs"],
    argTypes: {
        id: {
            type: "number",
            description: "id of the character in <a href='https://shikimori.one/api/doc/1.0/characters/show'>shikimori characters API</a>",
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;
export const Primary: Story = {
    args: {
        id: 142314,
    },
    render: ({ id }) => <CharacterPopoverCardWithHooks id={id} />,
};