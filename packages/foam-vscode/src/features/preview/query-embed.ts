/*global markdownit:readonly*/

import markdownItRegex from 'markdown-it-regex';
import { FoamWorkspace } from '../../core/model/workspace';
import { Logger } from '../../core/utils/log';
import { isNone } from '../../core/utils';

export const foamQuery = (md: markdownit, workspace: FoamWorkspace) => {
  return md.use(markdownItRegex, {
    name: 'foam-query',
    regex: /(```)query\s[\s\S]+(```)/gim,
    replace: (query: string) => {
      try {
        const resource = workspace.find(query);
        if (isNone(resource)) {
          return getFoamQuery(query);
        }
      } catch (e) {
        Logger.error(
          `Error while creating link for ${query} in Preview panel`,
          e
        );
        return getFoamQuery(query);
      }
    },
  });
};

const getFoamQuery = (content: string) =>
  `<p style='color: #f00;'>${content}</p>`;

export default foamQuery;
