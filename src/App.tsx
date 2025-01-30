import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { Report } from './pages/Report'
import { NoMatch } from './pages/NoMatch'
import AppLayout from './components/layout/AppLayout'
import { theme } from './theme/theme'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Transaction } from './types'
import { format } from 'date-fns'
import { formatMonth } from './utils/formatting'
import { Schema } from './validations/schema'

function App() {

  //Firestoreエラーかどうかを判定する型ガード
  function isFireStoreError(err: unknown): err is { code: string, message: string } {
    return typeof err === "object" && err !== null && "code" in err
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const a = format(currentMonth, "yyyy-MM")

  //firestoreのデータを全て取得
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Transactions"))
        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction
        });
        console.log(transactionsData);
        setTransactions(transactionsData);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("firestoreのエラーは:", err)
        } else {
          console.error("一般的なエラーは：", err)
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, [])

  //ひと月分のデータのみ取得
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  //取引を保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
    console.log(transaction);
    try {
      //firestoreにデータを保存
      const docRef = await addDoc(collection(db, "Transactions"), transaction);

      const newTransaction = {
        id: docRef.id,
        ...transaction
      } as Transaction;
      setTransactions(prevTransaction => [
        ...prevTransaction,
        newTransaction]);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは:", err)
      } else {
        console.error("一般的なエラーは：", err)
      }
    }
  };

  const handleDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    try {
      const idsToDelete = Array.isArray(transactionIds) ? transactionIds : [transactionIds]
      for(const id of idsToDelete){
        //firestoreのデータ削除
        await deleteDoc(doc(db, "Transactions", id))
      }
      // const filterdTransactions = transactions.filter(
      //   (transaction) => transaction.id !== transactionId);
      // setTransactions(filterdTransactions);
      const filterdTransactions = transactions.filter(
        (transaction) => !idsToDelete.includes(transaction.id));
      setTransactions(filterdTransactions);

    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは:", err)
      } else {
        console.error("一般的なエラーは：", err)
      }
    }
  };

  const handleUpdateTransaction = async (transaction: Schema, transactionId: string) => {
    try {
      //firestore更新処理
      const docRef = doc(db, "Transactions", transactionId);

      await updateDoc(docRef, transaction);
      //フロント更新
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId
          ? { ...t, ...transaction }
          : t) as Transaction[];
      setTransactions(updatedTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは:", err)
      } else {
        console.error("一般的なエラーは：", err)
      }
    }
  }




  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route
                index
                element={
                  <Home
                    monthlyTransactions={monthlyTransactions}
                    setCurrentMonth={setCurrentMonth}
                    onSaveTransaction={handleSaveTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                    onUpdateTransaction={handleUpdateTransaction}
                  />} />
              <Route
                path="/report"
                element={
                  <Report
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    monthlyTransactions={monthlyTransactions}
                    isLoading={isLoading}
                    onDeleteTransaction={handleDeleteTransaction}

                  />
                } />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
