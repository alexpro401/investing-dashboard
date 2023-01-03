/* eslint-disable */
import { storiesOf } from '@storybook/react';
import TopMembersBar from './index';

storiesOf('TopMembersBar', module).add('default', () => <TopMembersBar tabs={[
    {
        title: `All funds (${100})`,
        source: "/",
    },
    {
        title: `Basic (${200})`,
        source: "basic",
    },
    {
        title: `Investment (${300})`,
        source: "invest",
    },
]} />);
