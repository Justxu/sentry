import React from 'react';
import PropTypes from 'prop-types';

import {shallow} from 'enzyme';

import GroupMergedView from 'app/views/groupDetails/project/groupMerged';
import {Client} from 'app/api';
import events from 'app-test/mocks/events';

jest.mock('app/api');
jest.mock('app/mixins/projectState', () => {
  return {
    getFeatures: () => new Set([]),
  };
});

const mockData = {
  merged: [
    {
      latestEvent: events[0],
      state: 'unlocked',
      id: '2c4887696f708c476a81ce4e834c4b02',
    },
    {
      latestEvent: events[1],
      state: 'unlocked',
      id: 'e05da55328a860b21f62e371f0a7507d',
    },
  ],
};

describe('Issues -> Merged View', function() {
  let context = {
    group: {
      id: 'id',
      tags: [],
    },
  };
  beforeAll(function() {
    Client.addMockResponse({
      url: '/issues/groupId/hashes/?limit=50&query=',
      body: mockData.merged,
    });
  });

  it('renders initially with loading component', function() {
    let wrapper = shallow(
      <GroupMergedView
        params={{orgId: 'orgId', projectId: 'projectId', groupId: 'groupId'}}
        location={{query: {}}}
      />,
      TestStubs.routerContext()
    );

    expect(wrapper.find('LoadingIndicator')).toHaveLength(1);
  });

  it('renders with mocked data', async function() {
    let wrapper = shallow(
      <GroupMergedView
        params={{orgId: 'orgId', projectId: 'projectId', groupId: 'groupId'}}
        location={{query: {}}}
      />,
      {
        ...TestStubs.routerContext([
          {
            group: context,
          },
          {
            group: PropTypes.object,
          },
        ]),
        disableLifecycleMethods: false,
      }
    );

    await tick();
    await tick();
    wrapper.update();
    expect(wrapper.find('LoadingIndicator')).toHaveLength(0);
    expect(wrapper).toMatchSnapshot();
  });
});
