# 社用PC E2Eテスト環境 ツール申請チェックリスト

作成日：2026-10-05
目的：社用PCでPlaywrightによるE2Eテストを実行するため、必要なツールの社内承認状況を確認し、未承認のものを先に申請しておく。

---

## 使い方（3ステップ）

1. **社内の「承認済みソフトウェア一覧」を確認する**（社内ポータル・情シスの案内ページなど）
2. 下の表の「承認状況」欄に記入する
   - `済`：承認済み（申請不要）
   - `未`：一覧にない → 申請が必要
   - `?`：一覧に見当たらず判断できない → 情シスに問い合わせる
3. `未` と `?` のものを、後半の「申請文テンプレート」を使ってまとめて申請する

> 💡 1件ずつ申請するより、**用途（E2Eテスト環境の構築）を書いてまとめて申請**した方が、承認する側も判断しやすく早く通りやすいです。

---

## A. 必須ツール

| No | ツール | 用途 | 提供元 / ライセンス | 入手元 | 承認状況 | 申請日 | 許可日 |
|---|---|---|---|---|---|---|---|
| 1 | Git for Windows | テストコードのバージョン管理。Windows版Claude Codeの動作にも必要 | Git プロジェクト / GPLv2（無償） | https://gitforwindows.org/ | | | |
| 2 | Node.js（LTS版） | Playwright の実行基盤（npm 同梱） | OpenJS Foundation / MIT（無償） | https://nodejs.org/ | | | |
| 3 | Visual Studio Code | テストコードの作成・編集 | Microsoft / 無償（商用利用可） | https://code.visualstudio.com/ | | | |
| 4 | Claude Code | AIによるテストコード作成支援 | Anthropic / 有償プラン | https://claude.com/claude-code | 申請済み | | |
| 5 | Playwright（@playwright/test） | E2Eテスト本体（npmでプロジェクトに追加） | Microsoft / Apache 2.0（無償） | https://playwright.dev/ | | | |
| 6 | Playwright 用ブラウザ（Chromium / Firefox / WebKit） | テスト実行用ブラウザ | Microsoft 配布 | `npx playwright install` で取得 | | | |

## B. VS Code 拡張機能（会社によっては個別申請が必要）

| No | 拡張機能 | 用途 | 提供元 | 承認状況 | 申請日 | 許可日 |
|---|---|---|---|---|---|---|
| 7 | Claude Code for VS Code | VS Code 内で Claude Code を使う | Anthropic | | | |
| 8 | Playwright Test for VSCode | テストの実行・デバッグ・操作録画 | Microsoft | | | |

## C. あると便利（後からでも可）

| No | ツール | 用途 | 提供元 / ライセンス | 承認状況 |
|---|---|---|---|---|
| 9 | dotenv（npmパッケージ） | テスト環境URL・テスト用アカウントをコードと分けて管理 | OSS / BSD-2（無償） | |
| 10 | GitHub / GitLab（社内リポジトリ） | テストコードの共有・CIでの自動実行 | 社内規定に従う | |

---

## D. 通信許可（ファイアウォール・プロキシ）の確認

インストールが許可されても、通信が止められていると使えません。ツールと一緒に確認・申請します。

| 接続先 | 何のために使うか | 許可状況 |
|---|---|---|
| `api.anthropic.com` / `claude.ai` | Claude Code の利用・ログイン | |
| `registry.npmjs.org` | Playwright などの npm パッケージ取得 | |
| `cdn.playwright.dev` / `playwright.download.prss.microsoft.com` | Playwright 用ブラウザのダウンロード | |
| `marketplace.visualstudio.com` | VS Code 拡張機能のインストール | |
| `github.com`（使う場合） | コード管理・CI | |

- 社内プロキシの有無：（　あり　／　なし　）
- プロキシのアドレス（ありの場合）：
- ※ Claude Code の正確な接続先は、申請前に公式ドキュメントのネットワーク設定のページで最新情報を確認する

> 💡 **ブラウザのダウンロードが許可されない場合の代替案**
> Windows に標準で入っている **Microsoft Edge** を使ってテストを実行できます（Playwright の設定で `channel: 'msedge'` を指定）。申請時に「ダウンロード不可なら Edge で実行する」と添えておくと話が進みやすいです。

---

## E. ツール以外に確認しておくこと

| 確認事項 | 確認先 | 回答 |
|---|---|---|
| テスト対象の検証環境のURL | 開発チーム / 上長 | |
| テスト用アカウントの発行 | 開発チーム / 上長 | |
| 対象ブラウザ（Chrome/Edgeのみでよいか、Safari相当も必要か） | 上長 / PM | |
| テストコードの保存先（社内リポジトリ） | 上長 / 情シス | |
| Claude Code に社内のコード・仕様を読み込ませてよい範囲 | 情シス / セキュリティ担当 | |

---

## F. 申請文テンプレート

社内の申請フォームに合わせて、必要な部分を書き換えて使ってください。

```
件名：E2Eテスト自動化環境構築に伴うソフトウェア利用申請

【申請目的】
担当業務におけるWebシステムのE2Eテスト（画面操作の自動テスト）を
Playwrightで自動化するため、以下のツールの利用を申請いたします。
テストの実行時間短縮と、繰り返し実施する回帰テストの品質安定を目的としています。

【利用端末】
社用PC（端末番号：　　　　　）

【申請ツール】
1. Git for Windows（GPLv2・無償）　　　用途：テストコードのバージョン管理
2. Node.js LTS版（MIT・無償）　　　　　用途：Playwrightの実行基盤
3. Visual Studio Code（Microsoft・無償）用途：テストコードの作成
4. Playwright（Microsoft・Apache 2.0・無償）用途：E2Eテストの実行
   ※ Node.jsのパッケージ管理（npm）経由でプロジェクトに追加します
5. VS Code拡張機能
   - Claude Code for VS Code（Anthropic）
   - Playwright Test for VSCode（Microsoft）
※ Claude Code本体は別途申請済みです。

【通信許可のお願い（必要な場合）】
- registry.npmjs.org（npmパッケージ取得）
- cdn.playwright.dev / playwright.download.prss.microsoft.com（テスト用ブラウザ取得）
- marketplace.visualstudio.com（VS Code拡張機能）
- api.anthropic.com / claude.ai（Claude Code）
※ テスト用ブラウザのダウンロードが難しい場合は、
  端末標準のMicrosoft Edgeを利用して実行することも可能です。

【データの取り扱い】
テストは検証環境に対してのみ実行し、本番環境・本番データは使用しません。

以上、ご確認のほどよろしくお願いいたします。
```
