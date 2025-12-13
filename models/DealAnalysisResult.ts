export type DealAnalysisResult = {
    isValidDeal: boolean;
    discountPercentage: number;
    reason: string; //MOTIVAZIONE TESTUALE
    flags:{
        fakeDeal: boolean;
        lowHistory: boolean;
        thirdPartyOnly: boolean;
    }
}