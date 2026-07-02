Live demo

https://geo-safety-iota.vercel.app/

Getting started

1. Prerequisites
Node.js 14+ and npm
A free Supabase project
2. Install
npm install

Database setup

Run these SQL files in the Supabase SQL Editor, in this exact order. The
order matters — transactions reference companies, and the RLS grants reference
the functions.

supabase/seed_schema.sql — creates the companies, contracts, and
bank_transactions tables, all indexes, the updated_at trigger, and seeds
15 companies + 18 contracts.
supabase/seed_transactions.sql — seeds 89 bank transactions, all
starting as unmatched.
supabase/functions.sql — creates the two RPC functions:
match_transactions_by_inn() and get_expected_vs_actual(p_month).


Matching logic — სად დავდე და რატომ

მატჩინგის ლოგიკა ბაზაში დავდე, ერთი მარტივი მიზეზის გამო, რომ დამატებითი ოპერაციები ამერიდებინა თავიდან.
ალტერნატივა იყო, რომ ყველა ტრანზაქცია ბრაუზერში ჩამოგვეტვირთა, იქ შეგვედარებინა
კომპანიებთან, და თითო დამთხვევა ცალკე უკან გაგვეგზავნა ბაზაში ჩასაწერად, რაც ზედმეტი ოპერაცია გამოდიოდა, მონაცემი ორჯერ მოძრაობს ქსელში, და ჩაწერა ხდება ბევრ
ცალკეულ მოთხოვნად

ბაზაში კი ეს ერთი ოპერაციაა, ერთ ნაბიჯში ბაზა თვითონ პოულობს და აკავშირებს ყველა
დასამთხვევ ჩანაწერს, მონაცემის გადატანის გარეშე
