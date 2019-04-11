/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as execa from 'execa';
import {VizArgs, VizScripts} from './args';
import {assertNever} from './util';
import {build} from './viz/build';
import {buildMessage} from './viz/message';
import * as util from './viz/util';

const start = async (): Promise<void> => {
  await execa('webpack-dev-server', ['--open']);
};

const deploy = async (args: VizArgs): Promise<void> => {
  const buildValues = util.validateBuildValues(args);
  await execa('gsutil', [
    'cp',
    '-a',
    'public-read',
    'build/*',
    buildValues.gcsBucket,
  ]);
  console.log(`Viz deployed to: ${buildValues.gcsBucket}`);
};

export const main = async (args: VizArgs): Promise<void> => {
  switch (args.script) {
    case VizScripts.START:
      return start();
    case VizScripts.BUILD:
      return build(args);
    case VizScripts.PUSH:
      return deploy(args);
    case VizScripts.UPDATE_MESSAGE: {
      await buildMessage(args);
      return deploy(args);
    }
    default:
      return assertNever(args.script);
  }
};
