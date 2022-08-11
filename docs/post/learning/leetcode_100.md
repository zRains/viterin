---
toc: false
date: 1660200428044
title: '力扣100题'
link: '/post/learning/leetcode_100'
file: 'leetcode_100'
scope: ['algorithm']
buckets: ['post', 'learning']
draft: false
visible: true
lang: 'zh'
layout: 'page'

head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---

## 爬楼梯-70

### 描述

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

### 解决

可以理解为当爬到第 n 个台阶时的方法个数为$f(n) = f(n - 1) + f(n - 2)$，即爬 1 阶到 n-1 阶与爬 2 阶到 n-1 阶方法数的总和：

<CenterImg src="https://res.zrain.fun/images/2022/08/leetcode_100_climb%20stairs.png" alt="leetcode_100_climb_stairs" zoom="50%" source="https://app.diagrams.net/#R7Vxdd6o4FP01PrZLCF8%2BtradmYe7Vmf1zpp7HzMQkVUk3hirzq%2BfoInIQSS1DVTGvhQOIRx2zk52TiIDNJ6tf2N4Pv1GI5IO7GG0HqCHgW1bQysQ%2F3LLZmfxXH9niFkSyUKF4SX5l6g7pXWZRGRRKsgpTXkyLxtDmmUk5CUbZoyuysUmNC0%2FdY5jUjG8hDitWv9OIj7dWQPbL%2By%2FkySeqidb3mh3ZYZVYfkmiymO6OrAhB4HaMwo5buj2XpM0hw8hcvuvqeaq3vHGMm4zg3PP37%2BMf71%2FOcb%2Fevl1RdviEffb2QtbzhdyheWzvKNQoDRZRaRvJLhAN2vpgknL3Mc5ldXos2FbcpnqTizxOEkSdMxTSnb3osm4i8IhH3BGX0lB1eQh0ZIVHovHSCMk3Xtm1l7vESgETojnG1EEXmDPZQQb8D5qmgxR5qmB40VSBuWMRLvay5gFAcSyXegavcCVQegauuh6plCFfUC1QCg6uih6phC1ekDqsgGqHp6qNqmUHWbUSVZdJcPUOLsn5SGr9%2BnSVaGsoy7gIJtfuQnt646%2FXl47WFdOtvsz6KnJFV1kkgMb9IJyviUxjTD6WNhvQ%2BX7G370I%2B0Zv6Y020pxnHMYsKbQrPa5gdt6h5pU2VjJMU8eSu7cayh5ROeaSIcLEIKEhWOFgu6ZCGRdx2Ou6AiZ1SuyLJARTscKhWJ4MCbg2LzvMDiHQ47w5N%2BIdi%2Fl8uLg50HBQn2bXA%2BL7wrLz7OC9QPXsCK2uIF1MmwPFSTdgu88PswCjuwR%2Blahwe9QLUmfjvT4aM%2BoOpCxdi1Dle934XD6gFYuxbilkaG4%2F%2BlOBrlhYpEjVZvR3J4kKvnSg4ftSPFKw43SHH3tHQ3IzksjSzVRTCDrBN%2B8Exxtn%2BkOC6emJ%2BoB7bHplENmQTO26htJOLlsw5WZIh1FRY1CH23JsFplnWGs5hhSNzJpO18m%2BYob0zoW4azmC2hCsRToIeqMaFvaWQxvz6qDpjPW5qzUnNKXyMJdgGwgt7T0pyWmlP6GjmUi9Az5zbnGUrf0271djSHC7kKSairOTyrXNENMqQ5ajqX2qSnd7K8Ic3Ri4yNBTQH0szYmFvl70XGxgIRiTS1nDHVYWtkbL4%2BrHBPCtIUc8ZUh0LxwmEFqsPRFHPGVIetMfO4RNVhMCPyjlZvaUkTcNWB0aK9pAlJ75pRHdBh1WfX%2BWXDodNrQXXYhmePLe0sgsNj56rD8OyxpUXNmgjuTnX0cgW%2Be9XRyyX47lWHxozuqjqORuKXUR1w%2BeFs1eG55YpsQ6oDOqw6l9r1lZopkFHVofI8F8%2BMTlc1G5cmFZuaabf%2FoUzvaAfpYIp27xT7MMXYithHBrbZfJgObfHW5GbgZiZqD4Cd7iZAYOuNCzcB6NIObud14JTgk2hXmTM37OGxgpPlDdHOwO9MrrTrjCSVrvvsvfU1CZ%2FPJknF4QaSVPxqhSS9WG%2F3oAzoOhGFDGdMWoIVqriuE1HIcMakJVjhaNh1IgoZXgNvB1a4lbLzRJR62MVPt9vbdKMi8cuoDh8q6nNnxAH4paupRBR0uCkR5Z9OXJlRHc51RvwJbDpnRqwI1sxEv0vaeT6YEZ9Lu8qg4BuiHaQROk07D04OUBu0O7a%2F3kt5HpR0612EOb7Jj28WLNyW8H4t84%2FwCN7x%2FKtCd7mL9lNeZHEbUxqnBM%2BTxW1IZ8IcLkSRpwmeJWn%2BXt8IY8mKYD4lrKhJPGaCZZAqW23JokNQxp13228hCWeGljtfb4sWN3lx%2Fj8TF7c3Di31ktJxVaLS5QjtwctdTJmTGc0ggaUJp0kseqeHUBBSvAG6z5VMImC%2FkxdmSRRt2X9MOZU7stxF%2Ba0ny%2F2kNbpysAVuRRh5R7gMt4V%2BnjA6ti%2Bo%2F3FoX%2BMQaCC760A8liLsfyCiayDCxIaxQBSnxWfsdgN58TFA9Pgf"/>

从上图看出$f(3) = f(2) + f(1)$，可以进一步得出下面的递归公式：

$$
f(n) = \begin{cases}
1 & n = 1 \\
2 & n = 2 \\
f(n - 1) + f(n - 2) & n > 3
\end{cases}
$$
