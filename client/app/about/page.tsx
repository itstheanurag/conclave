import { Building, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-gray-900 text-white">
      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10">
          <div className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48">
            <svg
              viewBox="0 0 801 1036"
              aria-hidden="true"
              className="w-[50.0625rem]"
            >
              <path
                fill="url(#e8345310-2cf4-4aa5-952d-557b21f61d42)"
                fillOpacity=".3"
                d="m284.25 93.88 32.16 102.82 153.01-207.85-284.25 294.99S46.39 282.24 185.6 83.44l98.65 10.44Z"
              />
              <defs>
                <linearGradient
                  id="e8345310-2cf4-4aa5-952d-557b21f61d42"
                  x1="801"
                  x2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9089FC" />
                  <stop offset="1" stopColor="#FF80B5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    We’re changing the way people connect.
                  </h1>
                  <p className="relative mt-6 text-lg leading-8 text-gray-300 sm:max-w-md lg:max-w-none">
                    Cupidatat minim id magna ipsum sint dolor qui. Sunt sit
                    in quis cupidatat mollit aute velit. Et labore commodo nulla
                    aliqua proident mollit ullamco exercitation tempor. Sint
                    aliqua anim nulla sunt mollit id pariatur in voluptate sunt.
                  </p>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-.cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our mission
            </h2>
            <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
              <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                <p className="text-xl leading-8 text-gray-300">
                  Aliquet nec orci mattis amet quisque ullamcorper neque, nibh
                  sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque
                  id at vitae feugiat egestas ac. Diam nulla orci at in viverra
                  scelerisque eget. Eleifend egestas fringilla sapien.
                </p>
                <div className="mt-10 max-w-xl text-base leading-7 text-gray-400">
                  <p>
                    Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget
                    risus enim. Mattis mauris semper sed amet vitae sed turpis
                    id. Id dolor praesent donec est. Odio penatibus risus
                    viverra tellus varius sit neque erat velit. Faucibus commodo
                    massa rhoncus, volutpat. Dignissim sed eget risus enim.
                    Mattis mauris semper sed amet vitae sed turpis id.
                  </p>
                  <p className="mt-10">
                    Et vitae blandit facilisi magna lacus commodo. Vitae sapien
                    duis odio id et. Id blandit molestie auctor fermentum
                    dignissim. Lacus diam tincidunt ac cursus in vel. Mauris
                    varius vulputate et ultrices hac adipiscing egestas.
                  </p>
                </div>
              </div>
              <div className="lg:flex lg:flex-auto lg:justify-center">
                <dl className="w-64 space-y-8 xl:w-80">
                  <div className="flex flex-col-reverse gap-y-4">
                    <dt className="text-base leading-7 text-gray-400">
                      Transactions every 24 hours
                    </dt>
                    <dd className="text-5xl font-semibold tracking-tight">
                      44 million
                    </dd>
                  </div>
                  <div className="flex flex-col-reverse gap-y-4">
                    <dt className="text-base leading-7 text-gray-400">
                      Assets under holding
                    </dt>
                    <dd className="text-5xl font-semibold tracking-tight">
                      $119 trillion
                    </dd>
                  </div>
                  <div className="flex flex-col-reverse gap-y-4">
                    <dt className="text-base leading-7 text-gray-400">
                      New users annually
                    </dt>
                    <dd className="text-5xl font-semibold tracking-tight">
                      46,000
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our values
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam
              voluptatum cupiditate veritatis in accusamus quisquam.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div>
              <dt className="font-semibold">Be world-class</dt>
              <dd className="mt-1 text-gray-400">
                Aut illo quae. Ut et harum ea animi natus. Culpa maiores et sed
                voluptas aut distinctio.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Share everything you know</dt>
              <dd className="mt-1 text-gray-400">
                Mollitia delectus a omnis. Quae velit aliquid. Qui nulla maxime
                corrupti possimus.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Always learning</dt>
              <dd className="mt-1 text-gray-400">
                Aut repellendus et officiis dolor possimus. Deserunt velit quasi
                architecto.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Be supportive</dt>
              <dd className="mt-1 text-gray-400">
                Magnam provident veritatis odit. Vitae eligendi repellat non.
                Eum fugit impedit veritatis ducimus.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Take responsibility</dt>
              <dd className="mt-1 text-gray-400">
                Sit minus expedita quam in. Autem maiores occaecati similique eaque
                maxime.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Enjoy downtime</dt>
              <dd className="mt-1 text-gray-400">
                Commodo quia voluptatem. Nostrum occaecati tenetur enim et.
                Provident temporibus aut voluptatem.
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
