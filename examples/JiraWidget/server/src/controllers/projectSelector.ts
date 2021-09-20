import { Request, Response } from "express";
import { verifySharedToken } from "../services/jwt";
import { getAccessibleResources } from "../services/atlassian";
import { Unauthorized, InternalServerError } from "http-errors";
import { getToken } from "../services/store";
import { saveProject } from "../services/firestore";

/**
 * Callback of Zendesk OAuth process.
 *
 * @param {*} req
 * @param {*} res
 */
export default async function oauthCallback(req: Request, res: Response) {
  const { token, origin, projectId, baseUrl } = req.query;
  const user = verifySharedToken(token as string);

  try {
    const locals = await getToken(user, origin as string);

    if (projectId && baseUrl) {
      await saveProject(
        user,
        origin as string,
        projectId as string,
        baseUrl as string,
      );
    }

    const resources = await getAccessibleResources(locals);

    if (resources.code === 401) {
      throw new Unauthorized();
    }

    if (resources.code) {
      throw new InternalServerError();
    }

    const accessibleResources = resources.map((item: any) => ({
      ...item,
      selectUrl: `/project-selector?projectId=${item.id}&baseUrl=${item.url}&origin=${origin}&token=${token}`,
      selected: item.id === projectId || resources.length === 1,
    }));

    const onlyOneProject = resources.length === 1;

    if (onlyOneProject) {
      const singleProject = resources[0];
      await saveProject(
        user,
        origin as string,
        singleProject.id,
        singleProject.url,
      );
    }

    res.status(200).render("project-selector", {
      projectId: projectId || (onlyOneProject && resources[0].id),
      accessibleResources,
    });
  } catch (err) {
    console.log(err);
    res.status(200).render("setup-failed");
  }
}
