import React, { useState } from 'react'
import { api } from '../../utils/api'

export default function AddWordsModal(props: { setModal: (open: boolean) => void, currentRank: number }) {
    const [count, setCount] = useState<string>('')
    return (
        <div className='absolute inset-0 flex items-center justify-center bg-black/90'>
            <div className=' text-xl text-center lg:text-4xl lg:border-6 bg-green-900 border-4 px-6 lg:px-14 lg:py-8 py-4 rounded-2xl '>
                <h3 className='pb-4 font-medium'>How many words?</h3>
                <input type='number' value={count} onChange={(e) => { setCount(e.target.value) }} min={1} max={1000} className='w-1/2 px-1 text-center rounded-md bg-[#121212] shadow-sm focus:border-red-300 focus:ring' />
                <div className='flex py-4 justify-around'>
                    <button className='px-4 py-2 rounded-md bg-[#121212]'
                        onClick={() => { props.setModal(false) }}>Cancel</button>
                    <button className='px-4 py-2 rounded-md bg-[#121212]'
                        onClick={() => {
                            <AddWordsFunction count={parseInt(count)} currentRank={props.currentRank} />
                            props.setModal(false);
                        }}>Add</button>
                </div>
            </div>
        </div>
    )
}

function AddWordsFunction({ count, currentRank }: { count: number, currentRank: number }) {
    console.log(count, currentRank)
    const { data: words } = api.word.getFromRank.useQuery({ count, rank: currentRank });
    console.log(words);
    return (
        <div>
        </div>
    )
}