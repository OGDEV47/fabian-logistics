import Link from "next/link";
import { Package, MapPin, ShoppingCart, Truck, Bell, Layers } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-indigo-600" />
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  DemoLogistics
                </span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <Link
                  href="#how-it-works"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  How it Works
                </Link>
                <Link
                  href="#features"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  Pricing
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:block"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pb-32 pt-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative mx-auto mt-12 max-w-7xl px-4 text-center sm:mt-24 sm:px-6 lg:px-8">
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
            Your Global Shopping,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Delivered Locally
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Get your own US forwarding address today. Shop from your favorite US
            stores, and let us handle the shipping, consolidation, and delivery
            right to your door.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Free Account
            </Link>
            <Link
              href="#calculator"
              className="flex items-center gap-1 text-sm font-semibold leading-6 text-slate-900 transition-colors hover:text-indigo-600"
            >
              Calculate Shipping <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Simple Process
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How It Works
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Three simple steps to get your US purchases delivered
              internationally.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 shadow-sm">
                  <MapPin
                    className="h-8 w-8 text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900">
                  1. Get Address
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Sign up for free and instantly receive your personal US
                  shipping address.
                </dd>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 shadow-sm">
                  <ShoppingCart
                    className="h-8 w-8 text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900">
                  2. Shop Online
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Buy from Amazon, BestBuy, or any US retailer using your new
                  address at checkout.
                </dd>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 shadow-sm">
                  <Package
                    className="h-8 w-8 text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900">
                  3. Receive Packages
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  We receive your items, consolidate them if needed, and ship
                  them directly to you.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section
        id="features"
        className="border-t border-slate-100 bg-white py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Why Choose Us
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to ship globally
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                  <Truck
                    className="h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  Real-Time Tracking
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Track your packages from the moment they reach our warehouse
                    until they arrive at your door.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                  <Bell
                    className="h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  Pre-Alerts
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Submit pre-alerts for incoming packages to speed up
                    processing and ensure seamless forwarding.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                  <Layers
                    className="h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  Consolidation
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Save on international shipping costs by combining multiple
                    orders into a single, secure shipment.
                  </p>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-indigo-500" />
                <span className="text-xl font-bold tracking-tight text-white">
                  DemoLogistics
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-400">
                Making global shopping accessible with reliable and fast US mail
                forwarding services.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    Solutions
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link
                        href="#how-it-works"
                        className="text-sm leading-6 text-slate-400 transition-colors hover:text-white"
                      >
                        Shipping
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-sm leading-6 text-slate-400 transition-colors hover:text-white"
                      >
                        Consolidation
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#pricing"
                        className="text-sm leading-6 text-slate-400 transition-colors hover:text-white"
                      >
                        Pricing
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    Support
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link
                        href="/contact"
                        className="text-sm leading-6 text-slate-400 transition-colors hover:text-white"
                      >
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="text-sm leading-6 text-slate-400 transition-colors hover:text-white"
                      >
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/legal"
                        className="text-sm leading-6 text-slate-400 transition-colors hover:text-white"
                      >
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/legal"
                        className="text-sm leading-6 text-slate-400 transition-colors hover:text-white"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-slate-400">
              &copy; {new Date().getFullYear()} DemoLogistics, Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
