/*global markdownit:readonly*/

import markdownItRegex from 'markdown-it-regex';
import { FoamWorkspace } from '../../core/model/workspace';
import { Logger } from '../../core/utils/log';
import { isNone } from '../../core/utils';

export const foamQuery = (md: markdownit, workspace: FoamWorkspace) => {
  workspace.list().forEach(element => {
    if (element.type === 'note' && element.properties.type === 'project') {
      Logger.info(`${Object.getOwnPropertyNames(element.properties)}`);
    }
  });
  return md.use(markdownItRegex, {
    name: 'foam-query',
    regex: /(\?\?\?query\s[\s\S]*\s\?\?\?)/, // /(\?\?\?[0-9]*[\p{L}/_-][\p{L}\p{N}/_-]*\s*)/u,
    // regex: /(\{\{\{sql query\s[\s\S]*\s\}\}\})/,
    replace: (query: string) => {
      try {
        Logger.info(`Query: ${query}`);
        const resource = workspace.find(query);
        if (isNone(resource)) {
          let content = getFoamQuery(query);
          // content = md.render(content);
          return content;
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
  `<span class="foam-query">${content}</span>`;

export default foamQuery;
