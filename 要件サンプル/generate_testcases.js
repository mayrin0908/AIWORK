// テストケース自動生成スクリプト（ログイン機能サンプル）
const fs = require("fs");

// ① 因子水準定義
const factors = [
  {
    name: "メールアドレス",
    levels: ["登録済み", "未登録"],
  },
  {
    name: "パスワード",
    levels: ["正しい", "間違っている", "空欄"],
  },
  {
    name: "アカウント状態",
    levels: ["アクティブ", "ロック済み"],
  },
  {
    name: "ログイン試行",
    levels: ["初回", "3回失敗後"],
  },
];

// ② 期待結果ルール（条件 → 期待結果）
function getExpectedResult(tc) {
  const { メールアドレス, パスワード, アカウント状態, ログイン試行 } = tc;

  if (アカウント状態 === "ロック済み") {
    return "エラー：アカウントがロックされています";
  }
  if (メールアドレス === "未登録") {
    return "エラー：メールアドレスまたはパスワードが正しくありません";
  }
  if (パスワード === "空欄") {
    return "エラー：パスワードを入力してください";
  }
  if (パスワード === "間違っている") {
    if (ログイン試行 === "3回失敗後") {
      return "エラー：ログイン試行回数が上限に達しました（アカウントロック）";
    }
    return "エラー：メールアドレスまたはパスワードが正しくありません";
  }
  if (パスワード === "正しい" && メールアドレス === "登録済み") {
    return "ログイン成功：マイページへ遷移";
  }
  return "（未定義）";
}

// ③ 全組み合わせ生成
function cartesianProduct(factors) {
  return factors.reduce(
    (acc, factor) =>
      acc.flatMap((combo) =>
        factor.levels.map((level) => ({ ...combo, [factor.name]: level }))
      ),
    [{}]
  );
}

const combinations = cartesianProduct(factors);

// ④ テストケース表に展開
const testCases = combinations.map((tc, i) => ({
  テストケースID: `TC-${String(i + 1).padStart(3, "0")}`,
  ...tc,
  期待結果: getExpectedResult(tc),
}));

// ⑤ CSV出力
const headers = ["テストケースID", ...factors.map((f) => f.name), "期待結果"];
const csvLines = [
  headers.join(","),
  ...testCases.map((tc) =>
    headers.map((h) => `"${tc[h]}"`).join(",")
  ),
];
const csvContent = "﻿" + csvLines.join("\n"); // BOM付きUTF-8（Excel対応）

const outputPath = "./testcases_login.csv";
fs.writeFileSync(outputPath, csvContent, "utf8");

// ⑥ サマリー表示
console.log("=== テストケース生成完了 ===");
console.log(`因子数: ${factors.length}`);
console.log(`総組み合わせ数: ${testCases.length}`);
console.log(`出力ファイル: ${outputPath}`);
console.log("");
console.log("--- 期待結果の内訳 ---");
const resultSummary = {};
testCases.forEach((tc) => {
  resultSummary[tc.期待結果] = (resultSummary[tc.期待結果] || 0) + 1;
});
Object.entries(resultSummary).forEach(([result, count]) => {
  console.log(`  [${count}件] ${result}`);
});
console.log("");
console.log("--- 先頭5件プレビュー ---");
testCases.slice(0, 5).forEach((tc) => {
  console.log(
    `${tc.テストケースID} | ${tc.メールアドレス} / ${tc.パスワード} / ${tc.アカウント状態} / ${tc.ログイン試行} → ${tc.期待結果}`
  );
});
