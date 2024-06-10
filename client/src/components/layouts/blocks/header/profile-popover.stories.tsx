
import { ProfilePopover } from "@/components/layouts/blocks/header/profile-popover";
import { Meta, StoryObj } from "@storybook/react";
import { ComponentProps } from "react";

const ANIMEJOY_USER = {
    url: "https://animejoy.ru/user/Yarediska/",
    avatar: "//animejoy.ru/uploads/fotos/foto_13450.jpg",
    nickname: "Yarediska",
    unreadMessages: "0",
} as const;

const SHIKIMORI_USER = {
    id: 618936,
    nickname: "Yarediska",
    avatar: "https://desu.shikimori.one/system/users/x48/618936.png?1657823461",
    image: {
        x160: "https://desu.shikimori.one/system/users/x160/618936.png?1657823461",
        x148: "https://desu.shikimori.one/system/users/x148/618936.png?1657823461",
        x80: "https://desu.shikimori.one/system/users/x80/618936.png?1657823461",
        x64: "https://desu.shikimori.one/system/users/x64/618936.png?1657823461",
        x48: "https://desu.shikimori.one/system/users/x48/618936.png?1657823461",
        x32: "https://desu.shikimori.one/system/users/x32/618936.png?1657823461",
        x16: "https://desu.shikimori.one/system/users/x16/618936.png?1657823461",
    },
    last_online_at: "2024-06-09T08:13:20.739+03:00",
    url: "https://shikimori.one/Yarediska",
    name: null,
    sex: "male",
    website: "",
    birth_on: null,
    full_years: 24,
    locale: "ru",
} as const;

const meta: Meta<ComponentProps<typeof ProfilePopover>> = {
    component: ProfilePopover,
    tags: ["autodocs"],
    args: {
        className: "static",
    },
};

export default meta;

type Story = StoryObj<typeof meta>;
export const Unauthorized: Story = {
    args: {},
};
export const AnimejoyUser: Story = {
    args: {
        animejoyUser: ANIMEJOY_USER,
    },
};
export const ShikimoriUser: Story = {
    args: {
        shikimoriUser: SHIKIMORI_USER,
    },
};
export const BothUsers: Story = {
    args: {
        animejoyUser: ANIMEJOY_USER,
        shikimoriUser: SHIKIMORI_USER,
    },
};