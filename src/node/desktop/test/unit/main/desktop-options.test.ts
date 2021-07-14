/*
 * desktop-options.test.ts
 * 
 * Copyright (C) 2021 by RStudio, PBC
 * 
 * Unless you have received this program directly from RStudio pursuant
 * to the terms of a commercial license agreement with RStudio, then
 * this program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 */

import { describe } from 'mocha';
import { assert } from 'chai';

import { DesktopOptions, DesktopOptionsImpl, kDesktopOptionDefaults, clearOptionsSingleton } from '../../../src/main/desktop-options';
import { FilePath } from '../../../src/core/file-path';
import { Err, isSuccessful } from '../../../src/core/err';
import { tempDirectory } from '../unit-utils';

const kTestingConfigDirectory = tempDirectory('DesktopOptionsTesting').toString();

function testingDesktopOptions(): DesktopOptionsImpl {
  return DesktopOptions(kTestingConfigDirectory);
}

function deleteTestingDesktopOptions(): Err {
  clearOptionsSingleton();
  const filepath = new FilePath(kTestingConfigDirectory);
  return filepath.removeSync();
}

describe('DesktopOptions', () => {
  afterEach(() => {
    assert(isSuccessful(deleteTestingDesktopOptions()));
  });

  it('use default values', () => {
    const options = testingDesktopOptions();

    assert.equal(options.zoomLevel(), kDesktopOptionDefaults.zoomLevel);
    assert.deepEqual(options.windowBounds(), kDesktopOptionDefaults.windowBounds);
  });
  it('set/get functionality returns correct values', () => {
    const options = testingDesktopOptions();
    const newZoom = 123;
    const newWindowBounds = {width: 123, height: 321};

    options.setZoomLevel(newZoom);
    options.saveWindowBounds(newWindowBounds);

    assert.equal(options.zoomLevel(), newZoom);
    assert.deepEqual(options.windowBounds(), newWindowBounds);
  });
  it('values persist between instances', () => {
    const options1 = testingDesktopOptions();
    const newZoom = 1234;

    assert.equal(options1.zoomLevel(), kDesktopOptionDefaults.zoomLevel);
    options1.setZoomLevel(newZoom);
    assert.equal(options1.zoomLevel(), newZoom);

    clearOptionsSingleton();
    const options2 = testingDesktopOptions();
    assert.equal(options2.zoomLevel(), newZoom);
  });
});