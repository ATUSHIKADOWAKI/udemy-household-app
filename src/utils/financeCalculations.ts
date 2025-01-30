import { Balance, Transaction } from "../types";

//引数で渡されたtransactionの合計を計算
export function financeCalculations(transactions: Transaction[]): Balance {
    //reduceは繰り返し関数。
    return transactions.reduce((acc, transaction) => {
        if (transaction.type == "income") {
            acc.income += transaction.amount
        } else {
            acc.expense += transaction.amount
        }

        acc.balance = acc.income - acc.expense;

        return acc
    }, { income: 0, expense: 0, balance: 0 })//初期値
}

//1.日付ごとの収支を計算する関数💰
export function calculateDailyBalances(transactions: Transaction[]): Record<string, Balance> {
    return transactions.reduce<Record<string, Balance>>((acc, transaction) => {
        const day = transaction.date;
        if (!acc[day]) {
            acc[day] = { income: 0, expense: 0, balance: 0 }
        }
        if (transaction.type === "income") {
            acc[day].income += transaction.amount
        } else {
            acc[day].expense += transaction.amount
        }
        acc[day].balance = acc[day].income - acc[day].expense
        return acc
    }, {})//初期値

}