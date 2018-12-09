/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const {readSidebar, processMetadata} = require('../readMetadata');
const sidebarSubcategories = require('./__fixtures__/sidebar-subcategories');

jest.mock('../env', () => ({
  translation: {
    enabled: true,
    enabledLanguages: () => [
      {
        enabled: true,
        name: 'English',
        tag: 'en',
      },
      {
        enabled: true,
        name: '한국어',
        tag: 'ko',
      },
    ],
  },
  versioning: {
    enabled: true,
    defaultVersion: '1.0.0',
  },
}));

jest.mock(`${process.cwd()}/siteConfig.js`, () => true, {virtual: true});
jest.mock(`${process.cwd()}/sidebar.json`, () => true, {virtual: true});

describe('readMetadata', () => {
  describe('readSidebar', () => {
    test('should verify sub category data and verify order', () => {
      const items = readSidebar(sidebarSubcategories);
      expect(items).toMatchSnapshot();
    });
  });
});

describe('processMetadata', () => {
  test('transform link even in subdirectory', () => {
    const ret = processMetadata(
      path.join(__dirname, '__fixtures__', 'doc4.md'),
      path.join(__dirname, '__fixtures__'),
    );
    expect(ret.metadata).toHaveProperty('id', 'en-doc4');
    expect(ret.metadata).toHaveProperty('title', 'Document 4');
    expect(ret.metadata).toHaveProperty('source', 'doc4.md');
    expect(ret.metadata).toHaveProperty('version', 'next');
    expect(ret.metadata).toHaveProperty('permalink', 'docs/en/next/doc4.html');
    expect(ret.metadata).toHaveProperty('localized_id', 'doc4');
    expect(ret.metadata).toHaveProperty('language', 'en');
    expect(ret.rawContent).not.toBeNull();
  });
});
