import { GetServerSideProps, GetStaticProps } from "next"
import Image from "next/image";
import logo from '../assets/logo.svg'
import iconCheckImg from '../assets/icon-check.svg'
import usersAvatarExempleImg from '../assets/users-avatar-exemple.png'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso, o código foi copiado para área de transferência!')

      setPoolTitle('')

    } catch (error) {
      alert('Falha ao criar o bolão, tente novamente!')

      console.log(error)
    }

  }

  return (
    <div className="max-w-[1124px] mx-auto grid grid-cols-2 gap-28 items-center h-screen">
      <main>
        <Image 
          src={logo} 
          alt="NLW Copa" 
          quality={100}
        />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExempleImg} alt="" quality={100} />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> pessoas já estão usando
          </strong>
        </div>
        <form className="mt-10 flex gap-2" onSubmit={createPool}>
          <input 
            type="text" 
            required 
            value={poolTitle}
            onChange={event => setPoolTitle(event.target.value)}
            placeholder="Qual o nome do seu bolão?" 
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-gray-100 text-sm"
          />
          <button 
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-yellow-700 transition-colors"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"/>

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image 
        src={appPreviewImg} 
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa" 
        quality={100}
      />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: usersCountResponse.data.count,
    },
    revalidate: 10 * 60, // 10 min in seconds
  }
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
//     api.get('pools/count'),
//     api.get('guesses/count'),
//     api.get('users/count'),
//   ])

//   return {
//     props: {
//       poolCount: poolCountResponse.data.count,
//       guessCount: guessCountResponse.data.count,
//       userCount: usersCountResponse.data.count,
//     }
//   }
// }