import _ from "lodash";

import { CloseBracketState, GetBlockEndState, GetPathState } from "./";

import * as chars from "../Characters";
import * as errors from "../Errors";
import * as notifies from "../Notify";

import {
  ProcessMessage,
  NotifyMessage,
  StubbleMessage,
} from "../StubbleMessages";

import { StubbleError } from "../StubbleError";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";

export class GetWithBlockState implements StubbleState {
  private _path = "";
  private _body = "";
  private _symbol: number;
  private _line: number;

  constructor(symbol: number, line: number) {
    this._symbol = symbol;
    this._line = line;
  }

  getName() {
    return "GetWithBlockState";
  }

  canAcceptMessage(msg: StubbleMessage): boolean {
    if (msg instanceof ProcessMessage || msg instanceof NotifyMessage) {
      return true;
    }

    return false;
  }

  handleMessage(
    msg: StubbleMessage,
    context: StubbleContext
  ): StubbleResult | null {
    if (msg instanceof ProcessMessage) {
      return this.process(msg, context);
    }

    if (msg instanceof NotifyMessage) {
      return this.notify(msg, context);
    }

    return null;
  }

  process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null {
    let charCode = msg.charCode;

    if (charCode == chars.EOS) {
      return {
        err: new StubbleError(
          errors.ERROR_UNTERMINATED_BLOCK,
          `Unterminated "WITH" block at ${this._line}:${this._symbol}`
        ),
      };
    } else if (charCode == chars.CLOSE_BRACKET) {
      return {
        state: new CloseBracketState(),
      };
    } else if (charCode == chars.SPACE) {
      return null;
    }

    return {
      state: new GetPathState(""),
      message: new ProcessMessage(charCode),
    };
  }

  notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null {
    switch (msg.type) {
      case notifies.NOTIFY_PATH_RESULT:
        this._path = msg.value;

        return {
          message: new ProcessMessage(msg.charCode!),
        };

      case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
        return {
          state: new GetBlockEndState("with"),
        };

      case notifies.NOTIFY_BLOCK_END_RESULT:
        this._body = msg.value;
        return this.result(context);

      default:
        return null;
    }
  }

  result(context: StubbleContext): StubbleResult {
    let result: StubbleResult = {};

    if (!this._path) {
      result.err = new StubbleError(
        errors.ERROR_PATH_NOT_SPECIFIED,
        "With block required path to context data"
      );
    } else {
      try {
        let data = context.get(this._path);

        if (data != null) {
          if (_.isObject(data)) {
            let fn = context.compile(this._body);

            return {
              result: fn ? fn(data) : "",
              pop: true,
            };
          } else {
            result.err = new StubbleError(
              errors.ERROR_WITH_DATA_MALFORMED,
              '"With" block data should have "Object" type'
            );
          }
        } else {
          result.err = new StubbleError(
            errors.ERROR_PATH_WRONG_SPECIFIED,
            `Can\'t get data from context by path "${this._path}"`
          );
        }
      } catch (e: any) {
        result.err = new StubbleError(
          errors.ERROR_CALLING_HELPER,
          e.toString()
        );
      }
    }

    return result;
  }
}
