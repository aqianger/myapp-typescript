import GraphService from '../../services/graph.service';
import { Request, Response } from 'express';
import * as request from 'superagent';
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"

export class Controller {
  readAll(req: Request, res: Response): void {
    GraphService.readAll(req.rawHeaders[req.rawHeaders.indexOf('Authorization') + 1]).then((r: MicrosoftGraph.ListItem[]) => {
      if (r) res.json(r);
      else res.end();
    }).catch((err) => {
      res.statusMessage = err.message ? err.message : undefined;
      res.statusCode = err.status ? err.status : undefined;
      res.end();
    });
  }

  readById(req: Request, res: Response): void {
    GraphService.read(req.params.id, req.rawHeaders[req.rawHeaders.indexOf('Authorization') + 1]).then((r: MicrosoftGraph.ListItem) => {
      if (r) res.json(r);
      else res.end();
    }).catch((err) => {
      res.statusMessage = err.message ? err.message : undefined;
      res.statusCode = err.status ? err.status : undefined;
      res.end();
    });
  }

  deleteById(req: Request, res: Response): void {
    GraphService.delete(req.params.id, req.rawHeaders[req.rawHeaders.indexOf('Authorization') + 1]).then((r: request.Response) => {
      res.statusMessage = r.text;
      res.statusCode = r.status;
      res.end();
    }).catch((err) => {
      res.statusMessage = err.message ? err.message : undefined;
      res.statusCode = err.status ? err.status : undefined;
      res.end();
    });
  }

  updateById(req: Request, res: Response): void {
    GraphService.update(req.params.id, req.body, req.rawHeaders[req.rawHeaders.indexOf('Authorization') + 1]).then((r: MicrosoftGraph.FieldValueSet) => {
      if (r) res.json(r);
      else res.end();
    }).catch((err) => {
      res.statusMessage = err.message ? err.message : undefined;
      res.statusCode = err.status ? err.status : undefined;
      res.end();
    });
  }

  create(req: Request, res: Response): void {
    GraphService.create(req.body, req.rawHeaders[req.rawHeaders.indexOf('Authorization') + 1]).then((r: MicrosoftGraph.ListItem) => {
      if (r) res.json(r);
      else res.end();
    }).catch((err) => {
      res.statusMessage = err.message ? err.message : undefined;
      res.statusCode = err.status ? err.status : undefined;
      res.end();
    });
  }
}

export default new Controller();
