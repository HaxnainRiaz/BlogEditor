import React from 'react'

const ClientPage = () => {
    return (
        <div>
            <div className='px-4 py-6 rounded-2xl hover:bg-gradient-to-b flex gap-5 justify-center items-center from-[#6C6B6C] to-[#515151]'>
                <img className='h-[50px]' src="/Notify.png" alt="" />
                <div className='space-y-3'>
                    <div className='flex justify-between'>
                        <h2 className='text-xl text-white font-medium'>
                            KYC Document Shared
                        </h2>
                        <p className='text-[#bebebe81] text-xs'>
                            10m ago
                        </p>
                    </div>
                    <p className='text-[#BEBEBE] text-sm'>
                        Your KYC document shared with Bank A.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ClientPage
