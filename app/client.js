const anchor = require("@project-serum/anchor");

const provider = anchor.AnchorProvider.env();

async function main() {

    const idl = JSON.parse(
        require("fs").readFileSync("../target/idl/gm_anchor.json", "utf8")
    );

    const programId = new anchor.web3.PublicKey("EEw75JMPCXqS1Knh699ELCpDJ9Qgj8FLrXXCqzf23iUx");
    const gmAccount = anchor.web3.Keypair.generate();
    const program = new anchor.Program(idl, programId);
    const name = "Harry";
    let tx = await program.rpc.execute(name, {
        accounts: {
            gmAccount: gmAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId
        },
        options: { commitment: "confirmed" },
        signers: [gmAccount]
    });

    const storedName = await program.account.greetingAccount.fetch(gmAccount.publicKey);
    console.log(storedName.name.toString());
}

main().then(() => {
    console.log('Done')
})