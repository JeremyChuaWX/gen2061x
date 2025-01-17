"use client";

import { useMemo, useState } from "react";

type Scheme = {
    name: string;
    eligibility: {
        dob?: Date;
        age?: number;
        income?: number;
    };
    benefits: string;
};

const SCHEMES: Scheme[] = [
    {
        name: "Pioneer Generation Package",
        eligibility: {
            dob: new Date("12/31/1949"),
        },
        benefits:
            "- MediSave top-ups\n- Additional outpaitent care subsidies\n- CareShield\n- Additional Outpatient Care Subsidies\n - CareShield Life Additional Participation Incentives\n- Special MediShield Life Premium Subsidies\n- Pioneer Generation Disability Assistance Scheme",
    },
    {
        name: "Merdeka Generation Package",
        eligibility: {
            dob: new Date("12/31/1959"),
        },
        benefits:
            "- Additional Outpatient Care Subsidies\n- CareShield Life Additional Participation Incentives\n- Additional MediShield Life Premium Subsidies",
    },
    {
        name: "Lease Buyback Scheme",
        eligibility: {
            income: 14000,
        },
        benefits:
            "- Sell part of your flat's lease to HDB and choose to retain the length of lease based on the age of the youngest owner\n- Proceeds from selling part of your flat's lease will be used to top up your CPF Retirement Account (RA), and you can use your CPF RA to join CPF LIFE, which will provide you with a monthly income for life",
    },
];

export default function Home() {
    const [dob, setDob] = useState(new Date());
    const [income, setIncome] = useState(0);
    const [scheme, setScheme] = useState<Scheme>();
    const [open, setOpen] = useState(false);
    const age = useMemo(() => calculateAge(dob), [dob]);
    const schemes = useMemo(() => {
        return SCHEMES.filter((scheme) => {
            const {
                dob: schemeDob,
                age: schemeAge,
                income: schemeIncome,
            } = scheme.eligibility;
            const isDobEligible =
                !schemeDob || dob.getTime() <= schemeDob.getTime();
            const isAgeEligible = !schemeAge || age >= schemeAge;
            const isIncomeEligible = !schemeIncome || income <= schemeIncome;
            console.log(scheme.name, dob, schemeDob, isDobEligible);
            return isDobEligible && isAgeEligible && isIncomeEligible;
        });
    }, [age, dob, income]);
    const onClickAdditionalDetails = () => {
        alert("Filter by additional details not implemented.");
    };
    const onClickCard = (scheme: Scheme) => {
        setScheme(scheme);
        setOpen(true);
    };
    return (
        <>
            <div className="flex flex-col py-8 mx-auto space-y-8 w-[540px]">
                <div className="flex flex-col space-y-4">
                    <h1 className="text-lg font-bold">Senior Information</h1>
                    <div className="flex flex-col space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Date of birth
                        </label>
                        <input
                            type="date"
                            value={dob ? dob.toISOString().slice(0, 10) : ""}
                            onChange={(e) =>
                                setDob(
                                    e.target.value
                                        ? new Date(e.target.value)
                                        : new Date(),
                                )
                            }
                            className="py-2 px-4 w-full rounded-lg border border-gray-300 shadow-sm transition duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <label className="block text-sm font-medium text-gray-700">
                            Age: {age}
                        </label>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Monthly household income
                        </label>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) =>
                                setIncome(
                                    e.target.value
                                        ? parseInt(e.target.value)
                                        : 0,
                                )
                            }
                            className="py-2 px-4 w-full rounded-lg border border-gray-300 shadow-sm transition duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Additional details
                        </label>
                        <textarea
                            placeholder="Enter additional details here to be parsed by AI to match against complex eligibility criteria of schemes."
                            className="py-2 px-4 w-full rounded-lg border border-gray-300 shadow-sm transition duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[200px]"
                        />
                        <button
                            onClick={onClickAdditionalDetails}
                            className="self-end py-2 px-4 font-medium text-white bg-blue-600 rounded-lg shadow-md transition duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none w-fit"
                        >
                            Filter by additional details
                        </button>
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <h1 className="text-lg font-bold">Schemes</h1>
                    <div className="flex flex-wrap gap-4 w-full">
                        {schemes.length === 0 ? (
                            <p className="w-full text-center text-gray-400">
                                No schemes found
                            </p>
                        ) : (
                            schemes.map((scheme, idx) => (
                                <SchemeComponent
                                    scheme={scheme}
                                    handleClick={() => onClickCard(scheme)}
                                    key={idx}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
            <SchemePortal
                scheme={scheme}
                open={scheme !== undefined && open}
                handleClose={() => setOpen(false)}
            />
        </>
    );
}

function calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < dob.getDate())
    ) {
        age--;
    }
    return age;
}

function SchemeComponent({
    scheme,
    handleClick,
}: {
    scheme: Scheme;
    handleClick: () => void;
}) {
    return (
        <div
            onClick={handleClick}
            className="flex flex-col p-4 space-y-1 rounded-lg border border-gray-200 shadow-md transition-shadow duration-300 cursor-pointer hover:shadow-lg shadow-gray-400 w-[200px] h-[200px]"
        >
            <p className="font-bold">{scheme.name}</p>
            <div>
                <h2 className="text-sm">Eligibility</h2>
                {scheme.eligibility.age !== undefined && (
                    <p className="text-sm font-medium text-gray-700">
                        Age &ge; {scheme.eligibility.age}
                    </p>
                )}
                {scheme.eligibility.dob !== undefined && (
                    <p className="text-sm font-medium text-gray-700">
                        Date of birth &ge;{" "}
                        {scheme.eligibility.dob.toISOString().slice(0, 10)}
                    </p>
                )}
                {scheme.eligibility.income !== undefined && (
                    <p className="text-sm font-medium text-gray-700">
                        Monthly household income &le;{" "}
                        {scheme.eligibility.income}
                    </p>
                )}
            </div>
            <div className="overflow-hidden">
                <h2 className="text-sm">Benefits</h2>
                <p className="text-sm font-medium text-gray-700 whitespace-pre-wrap">
                    {scheme.benefits}
                </p>
            </div>
        </div>
    );
}

function SchemePortal({
    scheme,
    open,
    handleClose,
}: {
    scheme: Scheme | undefined;
    open: boolean;
    handleClose: () => void;
}) {
    if (scheme !== undefined && open) {
        return (
            <div className="flex absolute inset-0 top-0 left-0 justify-center items-center w-full h-full">
                <div
                    onClick={handleClose}
                    className="fixed inset-0 w-full h-full bg-black bg-opacity-50 cursor-pointer"
                ></div>
                <div className="flex z-50 flex-col p-4 mx-auto space-y-4 w-1/2 bg-white rounded-lg border border-gray-200 shadow-md transition-shadow duration-300 hover:shadow-lg shadow-gray-400">
                    <div className="flex justify-between items-center">
                        <p className="font-bold">{scheme.name}</p>
                        <button
                            onClick={handleClose}
                            className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md transition duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none w-fit"
                        >
                            Close
                        </button>
                    </div>
                    <div>
                        <h2>Eligibility</h2>
                        {scheme.eligibility.age !== undefined && (
                            <p className="font-medium text-gray-700">
                                Age &ge; {scheme.eligibility.age}
                            </p>
                        )}
                        {scheme.eligibility.dob !== undefined && (
                            <p className="font-medium text-gray-700">
                                Date of birth &ge;{" "}
                                {scheme.eligibility.dob
                                    .toISOString()
                                    .slice(0, 10)}
                            </p>
                        )}
                        {scheme.eligibility.income !== undefined && (
                            <p className="font-medium text-gray-700">
                                Monthly household income &le;{" "}
                                {scheme.eligibility.income}
                            </p>
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <h2>Benefits</h2>
                        <p className="font-medium text-gray-700 whitespace-pre-wrap">
                            {scheme.benefits}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
