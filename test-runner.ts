import { spawn } from "bun";
import { existsSync } from "fs";
import { join } from "path";

interface TestResult {
    filename: string;
    stdout: string;
    stderr: string;
    exitCode: number;
}

async function runTest(command: string, filename: string): Promise<TestResult> {
    const proc = spawn(["bun", "run", "app/main.ts", command, filename]);
    
    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;
    
    return {
        filename,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode
    };
}

async function runAllTests() {
    const testFiles = [
        "test1.lox",
        "test2.lox", 
        "test3.lox",
        "test4.lox"
    ];
    
    const commands = ["tokenize", "parse", "evaluate"];
    
    console.log("🚀 Running Lox Interpreter Tests\n");
    
    for (const file of testFiles) {
        if (!existsSync(file)) {
            console.log(`⚠️  Test file ${file} not found, skipping...`);
            continue;
        }
        
        console.log(`📁 Testing ${file}:`);
        console.log("=".repeat(50));
        
        for (const command of commands) {
            try {
                const result = await runTest(command, file);
                
                console.log(`\n🔧 Command: ${command}`);
                console.log(`📤 Output:`);
                if (result.stdout) {
                    console.log(result.stdout);
                } else {
                    console.log("(no output)");
                }
                
                if (result.stderr) {
                    console.log(`❌ Errors:`);
                    console.log(result.stderr);
                }
                
                console.log(`🏁 Exit Code: ${result.exitCode}`);
                
                if (command === "evaluate") {
                    console.log(`${result.exitCode === 0 ? "✅" : "❌"} ${command.toUpperCase()} ${result.exitCode === 0 ? "PASSED" : "FAILED"}`);
                }
                
            } catch (error) {
                console.log(`❌ Error running ${command}: ${error}`);
            }
        }
        
        console.log("\n" + "=".repeat(50) + "\n");
    }
}

// Create sample test files if they don't exist
function createSampleTests() {
    const tests = [
        {
            filename: "test1.lox",
            content: `print "Hello, World!";`
        },
        {
            filename: "test2.lox", 
            content: `var a = 5;
var b = 10;
print a + b;`
        },
        {
            filename: "test3.lox",
            content: `fun fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 2) + fibonacci(n - 1);
}

print fibonacci(8);`
        },
        {
            filename: "test4.lox",
            content: `var x = 42;
if (x > 10) {
    print "x is greater than 10";
} else {
    print "x is not greater than 10";
}

for (var i = 0; i < 3; i = i + 1) {
    print "Loop iteration: " + i;
}`
        }
    ];
    
    for (const test of tests) {
        if (!existsSync(test.filename)) {
            Bun.write(test.filename, test.content);
            console.log(`📝 Created sample test file: ${test.filename}`);
        }
    }
}

if (import.meta.main) {
    createSampleTests();
    await runAllTests();
}