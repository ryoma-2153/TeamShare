# Teamシェア

## 使用技術
- フロントエンド: React
- バックエンド: Firebase
- 認証機能: Firebase Authentication

## 目的
部活動やサークルなどのチーム活動を支援するためのアプリケーションです。チームの管理やコミュニケーションを円滑に行うことができます。

## 使い方
1. **ログイン**: Googleアカウントを使用してログインします。
2. **チームの選択**: チームの作成または既存のチームへの参加を選びます。
   - **チームの作成**: 任意のチーム名を入力し、作成ボタンを押します。
   - **チームへの参加**: 参加するチームのIDを入力し、参加ボタンを押します。
3. **チームページ**: 各チームページに移動し、チームの課題と目標の設定、スケジュール管理、出席登録を行います。


## プロジェクトのURL

[https://orizinal-app-login.web.app/](https://orizinal-app-login.web.app/)

## デモンストレーション

<img src="public/images/TeamShare.gif" alt="アプリのデモ" width="160" height="300">

## データ構成
- **Users**:
  - userId: ユーザーの一意のID
  - userName: ユーザー名
- **Groups**:
  - groupId: グループの一意のID
  - groupName: グループ名
  - members: { userId: "", userName: "" }
  - attendance: { attendCount: 出席回数, userName: "" }
  - absence: { absenceCount: 欠席回数, userName: "" }
  - tasks: { taskName: 入力した課題 }
  - goals: { goalName: 入力した目標 }
  - events: { id: 予定の一意のID, title: 入力した予定, start: 予定の始まる時間, end: 予定の終わる時間 }

## こだわり
- **ユーザーエクスペリエンス**: シンプルかつ使いやすい配色と操作を提供しています。
- **リアルタイム更新**: Firebaseを利用してリアルタイムでデータが更新されます。
- **セキュリティ**: Firebase Authenticationによる安全なログイン機能を実装しています。
- 現在所属している部活動での悩みを解決できるようにということから開発しました。

## 今後の予定
- コードの最適化とリファクタリング
- 新機能の追加（例えば、イベントスケジュール機能、通知機能）
- ユーザーフィードバックを基にした改善


